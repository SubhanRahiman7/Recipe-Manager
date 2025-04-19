import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const Home = () => {
  return (
    <Container maxW="container.xl">
      <VStack spacing={6} textAlign="center" py={20}>
        <Heading as="h1" size="2xl" color="teal.600">
          Welcome to Recipe Manager
        </Heading>
        <Text fontSize="xl" color="gray.600" maxW="container.md">
          Discover delicious recipes, plan your meals, and organize your shopping list all in one place.
        </Text>
        <Button
          as={RouterLink}
          to="/recipes"
          colorScheme="teal"
          size="lg"
          mt={4}
        >
          Explore Recipes
        </Button>
      </VStack>
    </Container>
  )
}

export default Home