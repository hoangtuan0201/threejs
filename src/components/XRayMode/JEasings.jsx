import { useFrame } from '@react-three/fiber'
import JEASINGS from 'jeasings'

/**
 * Component để update JEasings animation trong useFrame
 * Theo tài liệu: https://sbcode.net/react-three-fiber/jeasings/
 */
export default function JEasings() {
  useFrame(() => {
    JEASINGS.update()
  })

  return null
}