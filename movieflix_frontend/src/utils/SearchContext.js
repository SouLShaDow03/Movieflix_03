import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import debounce from "lodash.debounce";

// Create a context for the search functionality
const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const searchBarRef = useRef(null); // Ref for the search bar container
  // eslint-disable-next-line no-unused-vars
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);

  // Debounced function to update search query
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearchQuery = useCallback(
    debounce((query) => setSearchQuery(query), 300),
    [],
  );

  const openSearchBar = useCallback(() => setIsSearchBarOpen(true), []);
  const closeSearchBar = useCallback(() => {
    setIsSearchBarOpen(false);
    setSearchQuery(""); // Clear query when closing
  }, []);

  const toggleSearchBar = useCallback(() => {
    setIsSearchBarOpen((prev) => !prev);
  }, []);

  const handleFocus = () => setIsSearchBarFocused(true);
  const handleBlur = () => {
    setIsSearchBarFocused(false);
    // Start a timeout to clear search query when search bar is not focused
    if (!isSearchBarOpen) {
      const timeoutId = setTimeout(() => {
        setSearchQuery("");
      }, 3000);
      return () => clearTimeout(timeoutId); // Clear timeout on focus or when component unmounts
    }
  };

  const focusSearchInput = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const updateSearchQuery = useCallback(
    (query) => {
      debouncedSetSearchQuery(query);
    },
    [debouncedSetSearchQuery],
  );

  // Handle clicks outside the search bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        closeSearchBar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeSearchBar]);

  return (
    <SearchContext.Provider
      value={{
        isSearchBarOpen,
        searchQuery,
        searchInputRef,
        searchBarRef,
        setSearchQuery: updateSearchQuery,
        openSearchBar,
        closeSearchBar,
        toggleSearchBar,
        focusSearchInput,
        handleFocus,
        handleBlur,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
