// src/components/CommandPalette.js

import { Command } from 'cmdk';
import { useRouter } from 'next/router';
import { chatbotData } from '../data/bots';
import { useEffect, useState } from 'react';

export default function CommandPalette({ open, setOpen }) {
  const router = useRouter();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  const runCommand = (command) => {
    command();
    setOpen(false);
  };

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
      <Command.Input placeholder="Search for agents or actions..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        
        <Command.Group heading="Navigation">
          <Command.Item onSelect={() => runCommand(() => router.push('/'))}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Home / Explore
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => router.push('/dashboard'))}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
            Dashboard
          </Command.Item>
        </Command.Group>
        
        <Command.Group heading="Agents">
          {chatbotData.map((bot) => (
            <Command.Item key={bot.id} onSelect={() => runCommand(() => router.push(`/chat/${bot.id}`))}>
              <img src={bot.icon} alt={bot.name} style={{ width: 18, height: 18 }} />
              {bot.name}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}