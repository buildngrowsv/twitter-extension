import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainScreen from './components/MainScreen';
import KnowledgeBase from './components/KnowledgeBase';
import SettingsScreen from './components/SettingsScreen';

function App() {
  const [activeTab, setActiveTab] = useState('main');

  return (
    <div className="w-[600px] min-h-[400px] p-4 bg-background text-foreground">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="main">Home</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main">
          <MainScreen />
        </TabsContent>
        
        <TabsContent value="knowledge">
          <KnowledgeBase />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsScreen />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;