// Gửi ticket qua API backend proxy, không gọi trực tiếp Zendesk nữa
// Usage: createZendeskTicket({ name, email, subject, body, file })

export async function createZendeskTicket({ name, email, subject, comment, requester, attachment, body: messageBody, file }) {
  // Ưu tiên các trường mới: name, email, subject, body, file
  // Nếu không có thì fallback sang các trường cũ
  const apiUrl = 'https://api2.heartstribute.com/zendesk/ticket';
//   const apiUrl = 'http://localhost:4000/zendesk/ticket';

  // Nếu có file (PDF), gửi form-data
  if (attachment || file) {
    const formData = new FormData();
    formData.append('name', name || (requester && requester.name) || '');
    formData.append('email', email || (requester && requester.email) || '');
    formData.append('subject', subject || '');
    formData.append('body', messageBody || comment || '');
    formData.append('file', attachment || file);
    const res = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error('Proxy error: ' + err);
    }
    return await res.json();
  } else {
    // Không có file, gửi JSON
    const payload = {
      name: name || (requester && requester.name) || '',
      email: email || (requester && requester.email) || '',
      subject: subject || '',
      body: messageBody || comment || '',
    };
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error('Proxy error: ' + err);
    }
    return await res.json();
  }
} 