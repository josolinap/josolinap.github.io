import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(0);
  const [schemaStatus, setSchemaStatus] = useState({});
  const [isChecking, setIsChecking] = useState(true);
  const [isFixing, setIsFixing] = useState(false);
  const [envStatus, setEnvStatus] = useState({});

  const steps = [
    "Checking Database Schema",
    "Checking Environment Variables",
    "Setting up Missing Components",
    "Setup Complete"
  ];

  useEffect(() => {
    checkDatabaseSchema();
  }, []);

  const checkDatabaseSchema = async () => {
    try {
      // Check if notes table exists and what columns it has
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .limit(1);

      if (error) {
        setSchemaStatus({ error: 'Cannot access notes table' });
        return;
      }

      // Get column info by trying to select each column
      const columnsToCheck = ['id', 'content', 'tags', 'status', 'category', 'connections', 'updated_at'];
      const columnStatus = {};

      for (const column of columnsToCheck) {
        try {
          const testQuery = await supabase
            .from('notes')
            .select(column)
            .limit(1);
          columnStatus[column] = !testQuery.error;
        } catch (err) {
          columnStatus[column] = false;
        }
      }

      setSchemaStatus(columnStatus);
      setStep(1);
      checkEnvironmentVariables();
    } catch (err) {
      setSchemaStatus({ error: err.message });
    } finally {
      setIsChecking(false);
    }
  };

  const checkEnvironmentVariables = () => {
    const envVars = {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
      VITE_WORKER_URL: import.meta.env.VITE_WORKER_URL,
      VITE_ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD
    };

    const envStatusCheck = {};
    Object.keys(envVars).forEach(key => {
      envStatusCheck[key] = {
        exists: !!envVars[key],
        value: envVars[key]
      };
    });

    setEnvStatus(envStatusCheck);
    setStep(2);
  };

  const fixDatabaseSchema = async () => {
    setIsFixing(true);
    try {
      const missingColumns = Object.keys(schemaStatus).filter(col =>
        col !== 'error' && !schemaStatus[col]
      );

      if (missingColumns.length === 0) {
        setStep(3);
        return;
      }

      // Try to add missing columns using RPC or direct SQL execution
      // Note: This might not work depending on Supabase permissions
      const sqlCommands = [];

      if (!schemaStatus.tags) {
        sqlCommands.push("ALTER TABLE notes ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'");
      }
      if (!schemaStatus.status) {
        sqlCommands.push("ALTER TABLE notes ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'executed'))");
      }
      if (!schemaStatus.category) {
        sqlCommands.push("ALTER TABLE notes ADD COLUMN IF NOT EXISTS category VARCHAR(50)");
      }
      if (!schemaStatus.connections) {
        sqlCommands.push("ALTER TABLE notes ADD COLUMN IF NOT EXISTS connections INTEGER[] DEFAULT '{}'");
      }
      if (!schemaStatus.updated_at) {
        sqlCommands.push("ALTER TABLE notes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()");
      }

      // For now, we'll provide the SQL commands since direct execution might not be allowed
      console.log('SQL commands to run in Supabase:', sqlCommands);

      // Try to execute via Supabase RPC if available
      // This is a fallback - most users will need to run SQL manually
      alert(`Please run these SQL commands in your Supabase SQL editor:\n\n${sqlCommands.join(';\n\n')}`);

      setStep(3);
    } catch (err) {
      console.error('Error fixing schema:', err);
      alert('Automatic schema fix failed. Please run the SQL commands manually in Supabase.');
    } finally {
      setIsFixing(false);
    }
  };

  const createEnvironmentFile = () => {
    const missingVars = Object.keys(envStatus).filter(key => !envStatus[key].exists);

    if (missingVars.length === 0) {
      setStep(3);
      return;
    }

    const envTemplate = `# Required Environment Variables
${missingVars.map(key => `${key}=your_${key.toLowerCase()}_here`).join('\n')}

# Example:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
# VITE_GEMINI_API_KEY=your-gemini-api-key
# VITE_WORKER_URL=https://your-worker.workers.dev (optional)
# VITE_ADMIN_PASSWORD=your-admin-password (optional, defaults to admin123)
`;

    // Create downloadable .env file
    const blob = new Blob([envTemplate], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env.template';
    a.click();
    URL.revokeObjectURL(url);

    alert('Downloaded .env.template file. Fill in your values and rename to .env');
    setStep(3);
  };

  const completeSetup = () => {
    localStorage.setItem('setupComplete', 'true');
    onComplete();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: 'white'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '2rem',
        borderRadius: '10px',
        maxWidth: '600px',
        width: '90%'
      }}>
        <h2>🚀 AI Notes Setup Wizard</h2>
        <p>Step {step + 1} of {steps.length}: {steps[step]}</p>

        <div style={{ margin: '2rem 0' }}>
          {step === 0 && (
            <div>
              {isChecking ? (
                <p>🔍 Checking your database schema...</p>
              ) : (
                <div>
                  <h3>Database Schema Status:</h3>
                  {schemaStatus.error ? (
                    <p style={{ color: '#ff6b6b' }}>❌ {schemaStatus.error}</p>
                  ) : (
                    <div>
                      {Object.keys(schemaStatus).map(col => (
                        <p key={col}>
                          {schemaStatus[col] ? '✅' : '❌'} {col}
                        </p>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setStep(1)} style={{ marginTop: '1rem' }}>
                    Continue
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <h3>Environment Variables Status:</h3>
              {Object.keys(envStatus).map(key => (
                <p key={key}>
                  {envStatus[key].exists ? '✅' : '❌'} {key}
                </p>
              ))}
              <button onClick={() => setStep(2)} style={{ marginTop: '1rem' }}>
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3>Setup Actions:</h3>
              <button
                onClick={fixDatabaseSchema}
                disabled={isFixing}
                style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}
              >
                {isFixing ? 'Fixing Schema...' : 'Fix Database Schema'}
              </button>
              <button
                onClick={createEnvironmentFile}
                style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}
              >
                Download .env Template
              </button>
              <br />
              <button
                onClick={() => setStep(3)}
                style={{ margin: '1rem 0.5rem 0.5rem 0.5rem', padding: '0.5rem 1rem' }}
              >
                Skip to Complete
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3>🎉 Setup Complete!</h3>
              <p>Your AI Notes application is ready to use.</p>
              <p><strong>Note:</strong> You may need to manually run SQL commands in Supabase and set up environment variables.</p>
              <button
                onClick={completeSetup}
                style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
              >
                Start Using AI Notes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SetupWizard;
