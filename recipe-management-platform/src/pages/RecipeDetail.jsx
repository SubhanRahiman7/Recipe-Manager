import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Image,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  List,
  ListItem,
  Badge,
  Button,
  Spinner,
  Center,
  useToast
} from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { api } from '../services/api.js'

const RecipeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await api.getRecipeById(id)
        if (data) {
          setRecipe(data)
        } else {
          toast({
            title: 'Recipe not found',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
          navigate('/recipes')
        }
      } catch (error) {
        toast({
          title: 'Error loading recipe',
          description: 'Please try again later',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id, navigate, toast])

  const getIngredients = () => {
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`]
      const measure = recipe[`strMeasure${i}`]
      if (ingredient && ingredient.trim()) {
        ingredients.push({ ingredient, measure })
      }
    }
    return ingredients
  }

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    )
  }

  if (!recipe) return null

  return (
    <Container maxW="container.xl" py={8}>
      <Button
        leftIcon={<ChevronLeftIcon />}
        onClick={() => navigate('/recipes')}
        mb={8}
        variant="ghost"
      >
        Back to Recipes
      </Button>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
        <GridItem>
          <Image
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            borderRadius="lg"
            w="100%"
            h="auto"
            objectFit="cover"
          />
        </GridItem>

        <GridItem>
          <VStack align="start" spacing={4}>
            <Heading size="xl">{recipe.strMeal}</Heading>
            
            <HStack spacing={4}>
              <Badge colorScheme="teal" fontSize="md" px={3} py={1}>
                {recipe.strCategory}
              </Badge>
              <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
                {recipe.strArea} Cuisine
              </Badge>
            </HStack>

            {recipe.strTags && (
              <HStack spacing={2} flexWrap="wrap">
                {recipe.strTags.split(',').map(tag => (
                  <Badge key={tag} colorScheme="blue">
                    {tag.trim()}
                  </Badge>
                ))}
              </HStack>
            )}
          </VStack>
        </GridItem>
      </Grid>

      <Grid templateColumns={{ base: '1fr', md: '1fr 2fr' }} gap={8} mt={8}>
        <GridItem>
          <Box bg="gray.50" p={6} borderRadius="lg">
            <Heading size="md" mb={4}>Ingredients</Heading>
            <List spacing={3}>
              {getIngredients().map(({ ingredient, measure }, index) => (
                <ListItem key={index}>
                  <Text>
                    <Text as="span" fontWeight="bold">{measure}</Text> {ingredient}
                  </Text>
                </ListItem>
              ))}
            </List>
          </Box>
        </GridItem>

        <GridItem>
          <Box>
            <Heading size="md" mb={4}>Instructions</Heading>
            <VStack align="start" spacing={4}>
              {recipe.strInstructions.split('.').map((step, index) => {
                const trimmedStep = step.trim()
                return trimmedStep ? (
                  <Text key={index}>
                    <Text as="span" fontWeight="bold" mr={2}>
                      {index + 1}.
                    </Text>
                    {trimmedStep}.
                  </Text>
                ) : null
              })}
            </VStack>
          </Box>

          {recipe.strYoutube && (
            <Box mt={8}>
              <Heading size="md" mb={4}>Video Tutorial</Heading>
              <Button
                as="a"
                href={recipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="red"
                leftIcon={<span>▶</span>}
              >
                Watch on YouTube
              </Button>
            </Box>
          )}
        </GridItem>
      </Grid>
    </Container>
  )
}

export default RecipeDetail