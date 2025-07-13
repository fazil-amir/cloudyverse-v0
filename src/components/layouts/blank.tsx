import { ReactNode } from 'react'
import { Flex } from '@mantine/core'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Flex justify="center" align="center" h="100vh">
      {children}
    </Flex>
  )
}

export default Layout 