import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../components/AppTheme.jsx';
import AppAppBar from '../components/AppAppBar.jsx';
import MainContent from '../components/MainContent.jsx';
import Latest from '../components/Latest.jsx';
import Footer from '../components/Footer.jsx';

export default function Blog(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <MainContent />
        <Latest />
      </Container>
      <Footer />
    </AppTheme>
  );
}
