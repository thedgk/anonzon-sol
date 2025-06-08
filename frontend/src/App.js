import React, { useState } from 'react';
import { Container, Box, Stepper, Step, StepLabel, Paper, Fade, Slide, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ProductVerification from './components/ProductVerification';
import ShippingInfo from './components/ShippingInfo';
import Payment from './components/Payment';
import OrderConfirmed from './components/OrderConfirmed';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RevShare from './components/RevShare';
import Socials from './components/Socials';
import HowItWorks from './components/HowItWorks';

const steps = ['Product Verification', 'Shipping Information', 'Payment'];

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [orderData, setOrderData] = useState({
    products: [],
    shippingData: null,
    pricing: null
  });
  const theme = useTheme();

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
          <Box>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              alignItems: 'stretch',
              mb: 4
            }}>
              <Payment
                onBack={handleBack}
                orderData={orderData}
                hideSendSection={true}
              />
            </Box>
            {/* Payment Instructions and Loader */}
            <Box
              sx={{
                mt: 4,
                p: { xs: 2, md: 4 },
                borderRadius: 4,
                background: 'rgba(30, 34, 45, 0.55)',
                backdropFilter: 'blur(18px)',
                border: '1.5px solid rgba(255,255,255,0.13)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                textAlign: 'center',
                maxWidth: 600,
                mx: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box sx={{ fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', mb: 1 }}>
                Send <span style={{ color: 'var(--accent-color)' }}>{/* SOL amount will be shown here by Payment */}</span> SOL to address
              </Box>
              <Box sx={{ fontFamily: 'monospace', fontSize: 16, color: 'var(--accent-color)', mb: 2, wordBreak: 'break-all' }}>
                1AjXdhPauJ3dYJsKbLTrr15qVJauCRawtw8dXLRT25d
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Box className="loader" sx={{ width: 32, height: 32, border: '4px solid #fff2', borderTop: '4px solid var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <Box sx={{ fontWeight: 600, fontSize: 18, color: 'var(--text-secondary)' }}>
                  Waiting for payment...
                </Box>
              </Box>
            </Box>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: 'var(--primary-bg)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
            zIndex: 0
          }
        }}
      >
        <Routes>
          <Route path="/" element={
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
              <MotionBox 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ 
                  my: 4,
                  pt: { xs: 8, md: 12 },
                  pb: 8
                }}
              >
                <MotionPaper 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  sx={{ 
                    p: { xs: 2, md: 4 },
                    borderRadius: '16px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Stepper 
                    activeStep={activeStep} 
                    sx={{ 
                      mb: 4,
                      bgcolor: 'transparent',
                      '.MuiStepLabel-label': { 
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.9) !important',
                        fontSize: { xs: '0.875rem', md: '1rem' },
                      },
                      '.MuiStepIcon-root': { 
                        color: 'rgba(255, 255, 255, 0.2) !important',
                        '&.Mui-active': {
                          color: 'rgba(255, 255, 255, 0.9) !important',
                        },
                        '&.Mui-completed': {
                          color: 'rgba(255, 255, 255, 0.9) !important',
                        }
                      },
                      '.MuiStepIcon-text': {
                        fill: 'rgba(0, 0, 0, 0.9) !important',
                      },
                      '.MuiStepConnector-line': {
                        borderColor: 'rgba(255, 255, 255, 0.2) !important',
                      }
                    }}
                  >
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  <AnimatePresence mode="wait">
                    <MotionBox
                      key={activeStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderStepContent(activeStep)}
                    </MotionBox>
                  </AnimatePresence>
                </MotionPaper>
              </MotionBox>
            </Container>
          } />
          <Route path="/order-confirmed" element={<OrderConfirmed />} />
          <Route path="/revshare" element={<RevShare />} />
          <Route path="/socials" element={<Socials />} />
          <Route path="/howitworks" element={<HowItWorks />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
