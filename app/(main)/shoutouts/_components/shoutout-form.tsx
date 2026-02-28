'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { createShoutout } from './actions';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

export function ShoutoutForm() {
  const [toUserName, setToUserName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  return (
    <Card className="p-6 relative overflow-hidden">
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-ping">
            <Heart className="w-24 h-24 text-red-500 fill-red-500" />
          </div>
        </div>
      )}
      <form
        action={async (formData: FormData) => {
          const toUserName = formData.get('toUserName') as string;
          const message = formData.get('message') as string;

          if (!toUserName || toUserName.length < 2) {
            toast.error('Recipient name must be at least 2 characters');
            return;
          }

          if (!message || message.length < 5) {
            toast.error('Message must be at least 5 characters');
            return;
          }

          setIsSubmitting(true);

          const result = await createShoutout({ toUserName, message });

          setIsSubmitting(false);

          if (result.error) {
            toast.error(result.error);
          } else {
            toast.success('Shoutout sent!!');
            triggerCelebration();
            setToUserName('');
            setMessage('');
          }
        }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Give a Shoutout
          </h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="toUserName">To (Neighbor's Name)</Label>
          <Input
            id="toUserName"
            name="toUserName"
            type="text"
            placeholder="e.g., Sarah from apartment 3B"
            value={toUserName}
            onChange={(e) => setToUserName(e.target.value)}
            required
            minLength={2}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Your Message</Label>
          <textarea
            id="message"
            name="message"
            placeholder="Say thank you and spread positivity..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={5}
            disabled={isSubmitting}
            rows={4}
            className="w-full px-3 py-2 border rounded-md resize-vertical min-h-[100px] bg-background"
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending...' : (
            <>
              Send Shoutout <Heart className="w-4 h-4 ml-2" color='red' />
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
