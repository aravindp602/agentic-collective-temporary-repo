// src/components/CommandPalette.js
import { Command } from 'cmdk';
import { useRouter } from 'next/router';
import { chatbotData } from '../data/bots';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function CommandPalette({ open, setOpen, toggleTheme, handleSignOut, isLoggedIn }) {
    const router = useRouter();
    const currentBotId = router.query.botId;
    const currentBot = currentBotId && chatbotData.find(b => b.id === currentBotId);

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

                {currentBot && (
                    <Command.Group heading={`Actions for ${currentBot.name}`}>
                        <Command.Item onSelect={() => runCommand(() => router.push(`/lab/${currentBot.id}`))}>Open in Agent Lab</Command.Item>
                        <Command.Item onSelect={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Agent URL copied to clipboard!");
                            setOpen(false);
                        }}>Copy Agent Link</Command.Item>
                    </Command.Group>
                )}
                
                <Command.Group heading="Navigation">
                    <Command.Item onSelect={() => runCommand(() => router.push('/'))}>Home / Explore</Command.Item>
                    {isLoggedIn && <Command.Item onSelect={() => runCommand(() => router.push('/dashboard'))}>Dashboard</Command.Item>}
                </Command.Group>

                <Command.Group heading="General Actions">
                    <Command.Item onSelect={() => runCommand(toggleTheme)}>Toggle Theme</Command.Item>
                    {isLoggedIn && <Command.Item onSelect={() => runCommand(handleSignOut)}>Sign Out</Command.Item>}
                </Command.Group>
                
                <Command.Group heading="All Agents">
                    {chatbotData.map((bot) => (
                        <Command.Item key={bot.id} onSelect={() => runCommand(() => router.push(`/agent/${bot.id}`))}>
                            {bot.name}
                        </Command.Item>
                    ))}
                </Command.Group>
            </Command.List>
        </Command.Dialog>
    );
}