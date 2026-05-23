import { useCallback, useEffect, useMemo, useState } from 'react'
import FavoritesContext from './favoritesContext.js'

const STORAGE_KEY = 'cinestream:favorites'

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem(STORAGE_KEY)
      return savedFavorites ? JSON.parse(savedFavorites) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = useCallback((movie) => {
    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some((favorite) => favorite.id === movie.id)

      if (exists) {
        return currentFavorites.filter((favorite) => favorite.id !== movie.id)
      }

      return [movie, ...currentFavorites]
    })
  }, [])

  const isFavorite = useCallback(
    (movieId) => favorites.some((favorite) => favorite.id === movieId),
    [favorites],
  )

  const value = useMemo(
    () => ({
      favorites,
      favoriteCount: favorites.length,
      isFavorite,
      toggleFavorite,
    }),
    [favorites, isFavorite, toggleFavorite],
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
