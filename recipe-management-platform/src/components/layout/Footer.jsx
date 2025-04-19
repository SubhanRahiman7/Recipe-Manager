import { Box, Text } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box as="footer" py={4} bg="gray.100">
      <Text textAlign="center" color="gray.600">
        © {new Date().getFullYear()} Recipe Manager. All rights reserved.
      </Text>
    </Box>
  )
}

export default Footer