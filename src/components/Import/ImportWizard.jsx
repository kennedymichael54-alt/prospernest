import React, { useState } from 'react';
import Step1_UploadMap from './Step1_UploadMap';
import Step2_AccountTag from './Step2_AccountTag';
import Step3_Categorize from './Step3_Categorize';
import Step4_RecurringDetect from './Step4_RecurringDetect';
import Step5_ReviewConfirm from './Step5_ReviewConfirm';
import ImportSuccessModal from './ImportSuccessModal';

const ImportWizard = ({ hubType = 'home', onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Wizard state
  const [importData, setImportData] = useState({
    file: null,
    fileName: '',
    rawData: [],
    columnMappings: {
      date: '',
      amount: '',
      description: '',
      category: ''
    },
    savedTemplate: null,
    saveAsTemplate: false,
    templateName: '',
    accountTag: '',
    transactions: [],
    categorizedTransactions: [],
    merchantRules: [],
    recurringTransactions: [],
    billsToCreate: [],
    importSummary: null
  });

  const steps = [
    { num: 1, title: 'Upload & Map', icon: '📤' },
    { num: 2, title: 'Account Tag', icon: '🏷️' },
    { num: 3, title: 'Categorize', icon: '📁' },
    { num: 4, title: 'Recurring', icon: '🔁' },
    { num: 5, title: 'Review', icon: '✅' }
  ];

  const updateImportData = (updates) => {
    setImportData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = (summary) => {
    updateImportData({ importSummary: summary });
    setShowSuccess(true);
  };

  const handleSuccessClose = (navigateTo) => {
    setShowSuccess(false);
    if (onComplete) {
      onComplete(importData, navigateTo);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_UploadMap
            hubType={hubType}
            importData={importData}
            updateImportData={updateImportData}
            onNext={nextStep}
            onCancel={onCancel}
          />
        );
      case 2:
        return (
          <Step2_AccountTag
            hubType={hubType}
            importData={importData}
            updateImportData={updateImportData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <Step3_Categorize
            hubType={hubType}
            importData={importData}
            updateImportData={updateImportData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <Step4_RecurringDetect
            hubType={hubType}
            importData={importData}
            updateImportData={updateImportData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <Step5_ReviewConfirm
            hubType={hubType}
            importData={importData}
            updateImportData={updateImportData}
            onComplete={handleComplete}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.wizardContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.pennyIcon}>🪙</span>
          <div>
            <h2 style={styles.title}>Import Your Data</h2>
            <p style={styles.subtitle}>
              {hubType === 'home' ? 'HomeBudget Hub' : 'BizBudget Hub'} • Let Penny help organize your finances
            </p>
          </div>
        </div>
        <button style={styles.closeButton} onClick={onCancel}>✕</button>
      </div>

      {/* Progress Steps */}
      <div style={styles.progressContainer}>
        <div style={styles.progressTrack}>
          {steps.map((step, index) => (
            <React.Fragment key={step.num}>
              <div style={styles.stepItem}>
                <div
                  style={{
                    ...styles.stepCircle,
                    ...(currentStep >= step.num ? styles.stepCircleActive : {}),
                    ...(currentStep === step.num ? styles.stepCircleCurrent : {})
                  }}
                >
                  {currentStep > step.num ? '✓' : step.icon}
                </div>
                <span
                  style={{
                    ...styles.stepLabel,
                    ...(currentStep >= step.num ? styles.stepLabelActive : {})
                  }}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  style={{
                    ...styles.stepConnector,
                    ...(currentStep > step.num ? styles.stepConnectorActive : {})
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div style={styles.stepContent}>
        {renderStep()}
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <ImportSuccessModal
          hubType={hubType}
          importData={importData}
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
};

const styles = {
  wizardContainer: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(0, 0, 0, 0.2)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  pennyIcon: {
    fontSize: '40px',
    filter: 'drop-shadow(0 0 10px rgba(255, 200, 100, 0.5))',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    background: 'linear-gradient(90deg, #ff6b9d, #c44dff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  closeButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    padding: '24px 32px',
    background: 'rgba(0, 0, 0, 0.1)',
  },
  progressTrack: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0',
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  stepCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: 'rgba(255, 255, 255, 0.4)',
    transition: 'all 0.3s ease',
  },
  stepCircleActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '2px solid transparent',
    color: '#ffffff',
  },
  stepCircleCurrent: {
    boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)',
    transform: 'scale(1.1)',
  },
  stepLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '500',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  stepLabelActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  stepConnector: {
    width: '60px',
    height: '3px',
    background: 'rgba(255, 255, 255, 0.1)',
    marginBottom: '28px',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  stepConnectorActive: {
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
  },
  stepContent: {
    flex: 1,
    overflow: 'auto',
    padding: '32px',
  },
};

export default ImportWizard;
