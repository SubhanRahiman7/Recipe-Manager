import { Box, Flex, Link, Heading } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <Box bg="teal.500" px={4} color="white">
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="container.xl" mx="auto">
        <Heading size="md" as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
          Recipe Manager
        </Heading>
        <Flex gap={6}>
          <Link as={RouterLink} to="/recipes" _hover={{ textDecoration: 'none', color: 'teal.200' }}>
            Recipes
          </Link>
          <Link as={RouterLink} to="/planner" _hover={{ textDecoration: 'none', color: 'teal.200' }}>
            Meal Planner
          </Link>
          <Link as={RouterLink} to="/shopping-list" _hover={{ textDecoration: 'none', color: 'teal.200' }}>
            Shopping List
          </Link>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar