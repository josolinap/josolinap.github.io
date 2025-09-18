# Supabase Schema Guide

This guide contains the SQL commands to set up and maintain the database schema for the AI Notes application. Update this file whenever you make changes to the database structure in your code.

## Tables

### notes
Stores user notes with AI analysis capabilities.

```sql
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'executed')),
  category VARCHAR(50),
  connections INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Columns:
- `id`: Auto-incrementing primary key
- `content`: The text content of the note (required)
- `tags`: Array of tag strings (optional, defaults to empty array)
- `status`: Note status - 'draft', 'active', or 'executed' (defaults to 'active')
- `category`: Category for grouping notes (optional)
- `connections`: Array of note IDs that this note connects to (optional)
- `created_at`: Timestamp when the note was created (auto-generated)
- `updated_at`: Timestamp when the note was last updated (auto-generated)

#### Indexes:
```sql
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
```

## Usage Examples

### Insert a new note:
```sql
INSERT INTO notes (content, tags) VALUES ('This is my note', ARRAY['tag1', 'tag2']);
```

### Select all notes:
```sql
SELECT id, content, tags, created_at FROM notes ORDER BY created_at DESC;
```

### Select a random note:
```sql
SELECT content, tags FROM notes ORDER BY RANDOM() LIMIT 1;
```

## Schema Updates

When you add new features that require database changes:

1. Update the SQL commands above
2. Run the new SQL in your Supabase dashboard
3. Test the changes in your application
4. Commit the updated schema.md file

### Recent Changes:
- Added `tags` column as TEXT[] array to support note categorization

### Migration Commands

If you have an existing `notes` table, run these commands to add the new columns:

```sql
-- Add tags column if it doesn't exist
ALTER TABLE notes ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Add new columns for enhanced CMS functionality
ALTER TABLE notes ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'executed'));
ALTER TABLE notes ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE notes ADD COLUMN IF NOT EXISTS connections INTEGER[] DEFAULT '{}';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- AI Agent configuration and task history
CREATE TABLE agent_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompts JSONB DEFAULT '{}',
  mcp_connections JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE agent_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  result JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for agent tables
ALTER TABLE agent_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies (same as notes table)
CREATE POLICY "Anyone can read agent config" ON agent_config FOR SELECT USING (true);
CREATE POLICY "Anyone can insert agent config" ON agent_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update agent config" ON agent_config FOR UPDATE USING (true);

CREATE POLICY "Anyone can read agent tasks" ON agent_tasks FOR SELECT USING (true);
CREATE POLICY "Anyone can insert agent tasks" ON agent_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update agent tasks" ON agent_tasks FOR UPDATE USING (true);
```
