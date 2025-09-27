// src/components/CommandPalette.js

import { Command } from 'cmdk';
import { useRouter } from 'next/router';
import { chatbotData } from '../data/bots';
import { useEffect } from 'react';

export default function CommandPalette({ open, setOpen, toggleTheme, handleSignOut, isLoggedIn }) {
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
      <Command.Input placeholder="Type a command or search for an agent..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        
        <Command.Group heading="Navigation">
          <Command.Item onSelect={() => runCommand(() => router.push('/'))}>Home / Explore</Command.Item>
          {isLoggedIn && <Command.Item onSelect={() => runCommand(() => router.push('/dashboard'))}>Dashboard</Command.Item>}
        </Command.Group>

        {/* --- NEW ACTIONS GROUP --- */}
        <Command.Group heading="Actions">
            <Command.Item onSelect={() => runCommand(toggleTheme)}>Toggle Theme</Command.Item>
            {isLoggedIn && <Command.Item onSelect={() => runCommand(handleSignOut)}>Sign Out</Command.Item>}
        </Command.Group>
        
        <Command.Group heading="Agents">
          {chatbotData.map((bot) => (
            <Command.Item key={bot.id} onSelect={() => runCommand(() => router.push(`/embed/${bot.id}`))}>
              {bot.name}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}