﻿using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Storage
{
    public class AgentRepository : Repository<AgentItem>
    {
        public AgentRepository(IStorageContext<AgentItem> context) : base(context)
        {
        }

        public Task<IEnumerable<AgentItem>> GetAgentsByTypeAsync(string type)     
        {   
            return base.StorageContext.QueryEntitiesAsync(e => e.Type == type);
            
        }

        //function to return all agents
        public Task<IEnumerable<AgentItem>> GetAllAgentsAsync()
        {
            return base.StorageContext.QueryEntitiesAsync(e => true);
        }

        //function to retrun all agents depend on type and system agents
        public Task<IEnumerable<AgentItem>> GetAgentsAndSystemAsync(string type)
        {
            return base.StorageContext.QueryEntitiesAsync(e => e.Type == type || e.Type == "system");
        }

        //function Get by id
        public Task<AgentItem> GetAsync(string id, string type)
        {
            return base.StorageContext.ReadAsync(id, type);
        }


        //add new agent
        public Task AddAsync(AgentItem agent)
        {
            return base.StorageContext.CreateAsync(agent);
        }
    }    
}
