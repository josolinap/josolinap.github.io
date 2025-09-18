import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. Memory persistence will use localStorage only.')
}

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// Memory persistence functions
export class MemoryPersistence {
  constructor() {
    this.initialized = false
    this.tableName = 'ai_memory'
  }

  async initialize() {
    if (this.initialized || !supabase) return true

    try {
      // Create table if it doesn't exist (this would normally be done in SQL)
      const { error } = await supabase
        .from(this.tableName)
        .select('*')
        .limit(1)

      if (error && error.code === 'PGRST116') {
        // Table doesn't exist, we can't create it from here
        console.warn('Supabase table not found. Using localStorage only.')
        return false
      }

      this.initialized = true
      return true
    } catch (error) {
      console.warn('Failed to initialize Supabase memory:', error.message)
      return false
    }
  }

  async saveAgentState(agentId, state) {
    if (!this.initialized) return false

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .upsert({
          agent_id: agentId || 'global',
          state_data: state,
          updated_at: new Date().toISOString(),
          version: Date.now()
        }, {
          onConflict: 'agent_id'
        })

      if (error) throw error
      return true
    } catch (error) {
      console.warn('Failed to save agent state to Supabase:', error.message)
      return false
    }
  }

  async loadAgentState(agentId) {
    if (!this.initialized) return null

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('state_data')
        .eq('agent_id', agentId || 'global')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      return data?.state_data || null
    } catch (error) {
      console.warn('Failed to load agent state from Supabase:', error.message)
      return null
    }
  }

  async saveConversationHistory(agentId, conversation) {
    if (!this.initialized) return false

    try {
      const { data, error } = await supabase
        .from('conversations')
        .upsert({
          agent_id: agentId || 'global',
          conversation_data: conversation,
          message_count: conversation.length,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'agent_id'
        })

      if (error) throw error
      return true
    } catch (error) {
      console.warn('Failed to save conversation to Supabase:', error.message)
      return false
    }
  }

  async loadConversationHistory(agentId) {
    if (!this.initialized) return []

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('conversation_data')
        .eq('agent_id', agentId || 'global')
        .single()

      if (error) throw error
      return data?.conversation_data || []
    } catch (error) {
      console.warn('Failed to load conversation from Supabase:', error.message)
      return []
    }
  }

  async saveEvolutionProgress(objectives) {
    if (!this.initialized) return false

    try {
      const { data, error } = await supabase
        .from('evolution_progress')
        .upsert({
          objectives: objectives,
          updated_at: new Date().toISOString(),
          agent_id: 'global'
        })

      if (error) throw error
      return true
    } catch (error) {
      console.warn('Failed to save evolution progress:', error.message)
      return false
    }
  }

  async loadEvolutionProgress() {
    if (!this.initialized) return []

    try {
      const { data, error } = await supabase
        .from('evolution_progress')
        .select('objectives')
        .eq('agent_id', 'global')
        .single()

      if (error) throw error
      return data?.objectives || []
    } catch (error) {
      console.warn('Failed to load evolution progress:', error.message)
      return []
    }
  }

  async cleanupOldMemory(daysOld = 30) {
    if (!this.initialized) return false

    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const { error } = await supabase
        .from('ai_memory')
        .update({ archived: true })
        .lt('updated_at', cutoffDate.toISOString())

      if (error) throw error
      return true
    } catch (error) {
      console.warn('Failed to cleanup old memory:', error.message)
      return false
    }
  }
}

export const memoryPersistence = new MemoryPersistence()
