import { useState, useEffect } from 'react';

/**
 * Hook personalizado para otimizar carregamento de imagens de livros
 * Trabalha em conjunto com o sistema ui-avatars do backend
 */
export const useOptimizedImage = (originalSrc, title) => {
  const [src, setSrc] = useState(originalSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!originalSrc) {
      // Se não tem imagem, usar placeholder SVG local
      setSrc('/images/book-placeholder.svg');
      setIsLoading(false);
      return;
    }

    // Reset states quando src original muda
    setIsLoading(true);
    setHasError(false);
    setSrc(originalSrc);

    // Pre-carregar a imagem para detectar erros
    const img = new Image();
    
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      // Fallback para placeholder local
      setSrc('/images/book-placeholder.svg');
    };
    
    img.src = originalSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [originalSrc]);

  return {
    src,
    isLoading,
    hasError,
    handleError: () => {
      if (src !== '/images/book-placeholder.svg') {
        setSrc('/images/book-placeholder.svg');
        setHasError(true);
      }
    }
  };
};

export default useOptimizedImage;