import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import SearchHistory from './SearchHistory';

// Import the necessary functions from './req'
import { summarizeData, roast } from './req';

function SearchBar() {
  const [url, setUrl] = React.useState("");
  const [language, setLanguage] = React.useState("");
  const [canSendData, setCanSendData] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [response, setResponse] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // list pour les derniers recherche 
  const [searchHistory, setSearchHistory] = React.useState([]);


  const handleSummarize = async () => {
     try {
      const data = { language: language, url: url };
        setIsLoading(true);
        setIsSubmitting(true);
        handleSnackbarOpen()
        const result = await summarizeData(data);
        console.log("Réponse de summarizeData :", result.data.summary);

        // Vérifiez que les propriétés sont définies avant d'accéder à 'content'
        if (result && result.data && result.data.summary ) {
            setResponse(result.data.summary);
            // last research
            setSearchHistory(prevSearches => [`${language} Summarize: ${url}`, ...prevSearches.slice(0, 2)]);
        } else {
            console.error("La structure de la réponse est incorrecte ou 'content' est indéfini.");
        }
        setIsLoading(false);
        setSnackbarOpen(false); // Close the Snackbar when the response appears
        setIsSubmitting(false);
    } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des données :", error);
        // Gérez l'erreur de manière appropriée, par exemple, en définissant une réponse d'erreur
        setResponse("Une erreur s'est produite lors de la récupération des données.");
        setIsLoading(false);
        setSnackbarOpen(false); // Close the Snackbar when the response appears
        setIsSubmitting(false);
    } 
    
};
  
const handleRoast = async () => {
  try {
    setIsLoading(true);
    setIsSubmitting(true);
    handleSnackbarOpen(); // Open the Snackbar
    const data = { language: language, url: url };
    const result = await roast(data);
    console.log("Réponse de roast :", result);

    if (result && result.data && result.data.roast ) {
      setResponse(result.data.roast);
      // last research 
      setSearchHistory(prevSearches => [`${language} Roast: ${url}`, ...prevSearches.slice(0, 2)]);
    } else {
      console.error("Unexpected response structure from roast:", result);
    }

    setIsLoading(false);
    setSnackbarOpen(false); // Close the Snackbar when the response appears
    setIsSubmitting(false);
  } catch (error) {
    console.error("Error while handling roast:", error);
    // Handle the error appropriately, for example, show an error message to the user
    setIsLoading(false);
    setSnackbarOpen(false);
    setIsSubmitting(false);
  }
};

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const validateURL = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;
    if (urlPattern.test(url)) {
      setCanSendData(true);
      setErrorMessage("");
      setUrl(url);
    } else {
      setErrorMessage("Please enter a valid URL");
      setCanSendData(false);
    }
  };

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  return (

    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <FormControl error variant="standard">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'align',
          }}
        >
          <TextField
            error={errorMessage.length > 0}
            onChange={(event) => {
              validateURL(event.target.value);
            
            }}
            id="outlined-basic"
            label="Enter Website URL"
            variant="outlined"
            sx={{
              outlineColor: '#002B40',
              width: '100vh',
              marginRight :2


            }}
          ></TextField>

          <FormControl style={{ width: '30%' }}>
            <InputLabel>Language</InputLabel>
            <Select value={language} label="langue" onChange={handleLanguageChange}>
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value={'french'}>French</MenuItem>
              <MenuItem value={'english'}>English</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <FormHelperText id="component-error-text">{errorMessage}</FormHelperText>
      </FormControl>

      <Stack spacing={2} direction="row" sx={{ marginTop: 2, marginBottom : 5 }}>
        <Button variant="contained" disabled={!canSendData || isSubmitting} onClick={handleSummarize}>
          Summarize
        </Button>
        <Button variant="outlined" disabled={!canSendData || isSubmitting} onClick={handleRoast}>
          Roast
        </Button>
      </Stack>

      <Box
       sx={{
        flexDirection: 'column',
        marginLeft: 20, // Add margin to the left
        marginRight: 20, 
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 2,
        marginTop: 2,
        marginBottom: 5,
        width: 'auto', // Set width to auto
        display: 'inline-block', // Make it inline-block to fit the content
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',  // Increased contrast
      }}
      >

      {isLoading ? (
        <Box sx={{  }}>
          <Skeleton animation="wave"  width={1000} height={20} sx={{margin : 1}}/>
          <Skeleton animation="wave"  width={1000} height={20} sx={{margin : 1}}/>
          <Skeleton animation="wave"  width={1000} height={20} sx={{margin : 1}}/>
          <Skeleton animation="wave"  width={1000} height={20} sx={{margin : 1}}/>
        </Box>
      ) : response ? (
        <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginLeft: 10,
        marginRight: 10,
        }}>{response}</Box>
      ) : null}
      </Box>
      <SearchHistory searchHistory={searchHistory} />

      <Snackbar
        open={snackbarOpen}
        message="Fetching data..."
        autoHideDuration={4000} // Adjust the duration as needed
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Set anchor origin to top-center

      />
    </Box>
  );
}

export default SearchBar;
