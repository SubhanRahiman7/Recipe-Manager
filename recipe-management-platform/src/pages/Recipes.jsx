import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  VStack,
  HStack,
  Text,
  Spinner,
  Center
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import RecipeCard from '../components/recipe/RecipeCard.jsx'
import { api } from '../services/api.js'

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [recipesData, categoriesData] = await Promise.all([
          api.getRecipes(),
          api.getCategories()
        ])
        setRecipes(recipesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching initial data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  useEffect(() => {
    const searchRecipes = async () => {
      if (searchQuery.trim()) {
        setLoading(true)
        const results = await api.searchRecipes(searchQuery)
        setRecipes(results)
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchRecipes, 500)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const filteredRecipes = recipes?.filter(recipe => 
    !selectedCategory || recipe.strCategory === selectedCategory
  )

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    )
  }

  return (
    <Container maxW="container.xl">
      <VStack spacing={8} py={8}>
        <Heading>Discover Recipes</Heading>
        
        <HStack w="full" spacing={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          
          <Select
            placeholder="All Categories"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            minW="200px"
          >
            {categories.map(category => (
              <option key={category.strCategory} value={category.strCategory}>
                {category.strCategory}
              </option>
            ))}
          </Select>
        </HStack>

        {filteredRecipes?.length === 0 ? (
          <Text color="gray.500">No recipes found</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
            {filteredRecipes?.map(recipe => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  )
}

export default Recipes