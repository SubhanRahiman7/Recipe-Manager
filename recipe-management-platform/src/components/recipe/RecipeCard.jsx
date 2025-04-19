import { Box, Image, Heading, Text, VStack, Badge } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const RecipeCard = ({ recipe }) => {
  return (
    <Box
      as={RouterLink}
      to={`/recipe/${recipe.idMeal}`}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'lg',
        textDecoration: 'none'
      }}
      transition="all 0.2s"
    >
      <Image
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        width="100%"
        height="200px"
        objectFit="cover"
      />
      <VStack p={4} align="start" spacing={2}>
        <Heading size="md" noOfLines={1}>
          {recipe.strMeal}
        </Heading>
        <Badge colorScheme="teal">
          {recipe.strCategory}
        </Badge>
        <Text color="gray.600" fontSize="sm" noOfLines={2}>
          {recipe.strArea} cuisine
        </Text>
      </VStack>
    </Box>
  )
}

export default RecipeCard