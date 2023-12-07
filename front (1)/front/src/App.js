import './App.css';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';
import SearchBar from './Components/SearchBar';

function App() {
  return (
  <Box sx={{
    background: 'linear-gradient(to bottom, #F7DC6F, white)',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 1,
  }}>


<Typography variant="h1" gutterBottom sx={{color:'#002B40',
marginTop:30
}}>
  
  What does this company do ?
</Typography>
<SearchBar/>

  </Box>


  );
}

export default App;
