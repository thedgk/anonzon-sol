import React, { useState } from 'react';
import { Container, Box, Stepper, Step, StepLabel, Paper } from '@mui/material';
import ProductVerification from './components/ProductVerification';
import ShippingInfo from './components/ShippingInfo';
import Payment from './components/Payment';
import OrderConfirmed from './components/OrderConfirmed';
import { Routes, Route } from 'react-router-dom';

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
    <Routes>
      <Route path="/" element={
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {renderStepContent(activeStep)}
            </Paper>
          </Box>
        </Container>
      } />
      <Route path="/order-confirmed" element={<OrderConfirmed />} />
    </Routes>
  );
}

export default App;
