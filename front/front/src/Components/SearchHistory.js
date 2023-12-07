import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import ListItemIcon from '@mui/material/ListItemIcon';

function SearchHistory({ searchHistory }) {
  return (
<Paper elevation={3} sx={{ p: 2, mt: 2, maxWidth: 400 }}>
  <Typography variant="h6" gutterBottom>
    Last 3 Searches
  </Typography>
  <List>
    {searchHistory.slice(0, 3).map((search, index) => (
      <ListItem key={index} dense>
        <ListItemIcon>
          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
        </ListItemIcon>
        <ListItemText primary={search} />
      </ListItem>
    ))}
  </List>
</Paper>
  );
}

export default SearchHistory;