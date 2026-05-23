import { useContext } from 'react'
import FavoritesContext from '../context/favoritesContext.js'

const useFavorites = () => {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider.')
  }

  return context
}

export default useFavorites
