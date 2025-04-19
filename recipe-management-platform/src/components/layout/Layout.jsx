import { Box } from '@chakra-ui/react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

const Layout = ({ children }) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex="1" as="main" py={8} px={4}>
        {children}
      </Box>
      <Footer />
    </Box>
  )
}

export default Layout