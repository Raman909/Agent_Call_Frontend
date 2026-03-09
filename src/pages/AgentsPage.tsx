import { useState, useEffect } from 'react';
import { Bot, BookOpen, Edit, Trash2, Plus, Minus } from 'lucide-react';
import api from '../api/axios';


interface KnowledgeBase {
  _id: string;
  fileName: string;
}

interface Agent {
  _id: string;
  name: string;
  systemPrompt: string;
  greeting: string;
  knowledgeBase: KnowledgeBase[];
  createdAt: string;
}

const AgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchAgents();
    fetchKnowledgeBases();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/agents');
      setAgents(response.data.agents || []);
    } catch (error) {
      // toast.error('Failed to load agents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKnowledgeBases = async () => {
    try {
      const response = await api.get('/agents/kb');
      setKnowledgeBases(response.data.kbs || []);
    } catch (error) {
      console.error('Failed to load knowledge bases', error);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      await api.delete(`/agents/${agentId}`);
      // toast.success('Agent deleted successfully');
      fetchAgents();
    } catch (error) {
      // toast.error('Failed to delete agent');
      console.error(error);
    }
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setShowEditModal(true);
  };

  const handleUpdateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;

    try {
      const response = await api.put(`/agents/${editingAgent._id}`, {
        name: editingAgent.name,
        systemPrompt: editingAgent.systemPrompt,
        greeting: editingAgent.greeting,
      });
      // toast.success('Agent updated successfully');
      setShowEditModal(false);
      setEditingAgent(null);
      fetchAgents();
    } catch (error) {
      // toast.error('Failed to update agent');
      console.error(error);
    }
  };

  const handleAttachKB = async (agentId: string, kbId: string) => {
    try {
      await api.post('/agents/attach-kb', { agentId, kbId });
      // toast.success('Knowledge base attached');
      fetchAgents();
    } catch (error) {
      // toast.error('Failed to attach knowledge base');
      console.error(error);
    }
  };

  const handleDetachKB = async (agentId: string, kbId: string) => {
    // Note: This endpoint might need to be added to backend
    try {
      await api.delete(`/agents/${agentId}/kb/${kbId}`);
      // toast.success('Knowledge base detached');
      fetchAgents();
    } catch (error) {
      // toast.error('Failed to detach knowledge base');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI Agents
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your AI agents and their knowledge bases. Total agents: {agents.length}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <div
            key={agent._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Bot className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created {new Date(agent.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditAgent(agent)}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Edit Agent"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteAgent(agent._id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete Agent"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System Prompt
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {agent.systemPrompt}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Greeting
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                "{agent.greeting}"
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                Knowledge Bases ({agent.knowledgeBase.length})
              </h4>
              {agent.knowledgeBase.length > 0 ? (
                <div className="space-y-2">
                  {agent.knowledgeBase.map((kb) => (
                    <div
                      key={kb._id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded p-2"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {kb.fileName}
                      </span>
                      <button
                        onClick={() => handleDetachKB(agent._id, kb._id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Detach Knowledge Base"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No knowledge bases attached
                </p>
              )}

              {/* Attach new KB dropdown */}
              <div className="mt-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAttachKB(agent._id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Attach Knowledge Base
                  </option>
                  {knowledgeBases
                    .filter((kb) => !agent.knowledgeBase.some((attached) => attached._id === kb._id))
                    .map((kb) => (
                      <option key={kb._id} value={kb._id}>
                        {kb.fileName}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {agents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No agents yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create your first AI agent to get started.
          </p>
        </div>
      )}

      {/* Edit Agent Modal */}
      {showEditModal && editingAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Edit Agent
            </h2>
            <form onSubmit={handleUpdateAgent}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editingAgent.name}
                  onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  System Prompt
                </label>
                <textarea
                  value={editingAgent.systemPrompt}
                  onChange={(e) => setEditingAgent({ ...editingAgent, systemPrompt: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-24"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Greeting
                </label>
                <input
                  type="text"
                  value={editingAgent.greeting}
                  onChange={(e) => setEditingAgent({ ...editingAgent, greeting: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  Update Agent
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsPage;