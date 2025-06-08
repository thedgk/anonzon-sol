import React, { useState } from 'react';
import { Container, Box, Stepper, Step, StepLabel, Paper, Fade, Slide } from '@mui/material';
import ProductVerification from './components/ProductVerification';
import ShippingInfo from './components/ShippingInfo';
import Payment from './components/Payment';
import OrderConfirmed from './components/OrderConfirmed';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

const steps = ['Product Verification', 'Shipping Information', 'Payment'];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [orderData, setOrderData] = useState({
    products: [],
    shippingData: null,
    pricing: null
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const updateOrderData = (data) => {
    setOrderData((prev) => {
      if (data.product) {
        return { ...prev, products: [...prev.products, data.product] };
      }
      return { ...prev, ...data };
    });
  };

  const resetForNewProduct = () => {
    setActiveStep(0);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ProductVerification
            onNext={handleNext}
            updateOrderData={updateOrderData}
          />
        );
      case 1:
        return (
          <ShippingInfo
            onNext={handleNext}
            onBack={handleBack}
            updateOrderData={updateOrderData}
            shippingData={orderData.shippingData}
            products={orderData.products}
            resetForNewProduct={resetForNewProduct}
          />
        );
      case 2:
        return (
          <Payment
            onBack={handleBack}
            orderData={orderData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <Box 
        className="privacy-container"
        sx={{ 
          mt: 10,
          minHeight: '100vh',
          pb: 8,
          background: 'var(--privacy-gradient)'
        }}
      >
        <Routes>
          <Route path="/" element={
            <Container maxWidth="md">
              <Box sx={{ my: 4 }}>
                <Slide in direction="down" timeout={700}>
                  <Paper 
                    className="privacy-card"
                    sx={{ 
                      p: 3,
                      borderRadius: 3,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      background: 'var(--secondary-bg)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <Fade in timeout={1200}>
                      <Stepper 
                        activeStep={activeStep} 
                        sx={{ 
                          mb: 4,
                          bgcolor: 'transparent',
                          '.MuiStepLabel-label': { 
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                          },
                          '.MuiStepIcon-root': { 
                            color: 'var(--accent-color) !important'
                          },
                          '.MuiStepIcon-text': {
                            fill: 'var(--text-primary) !important'
                          },
                          '.MuiStepConnector-line': {
                            borderColor: 'var(--border-color) !important'
                          }
                        }}
                      >
                        {steps.map((label) => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Fade>
                    <Fade in timeout={1500}>
                      <Box>
                        {renderStepContent(activeStep)}
                      </Box>
                    </Fade>
                  </Paper>
                </Slide>
              </Box>
            </Container>
          } />
          <Route path="/order-confirmed" element={<OrderConfirmed />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
