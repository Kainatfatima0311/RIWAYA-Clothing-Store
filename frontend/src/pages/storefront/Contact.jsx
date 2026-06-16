import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { BRAND_NAME } from '@/lib/constants';

// Update these with the store's real details (owner-editable).
const CONTACT = {
  email: 'hello@riwaya.com',
  phone: '+92 300 1234567',
  address: 'DHA Phase 5, Lahore, Pakistan',
  hours: 'Mon–Sat, 11:00 AM – 9:00 PM',
};

const DETAILS = [
  { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: Phone, label: 'Phone', value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s+/g, '')}` },
  { icon: MapPin, label: 'Visit us', value: CONTACT.address },
  { icon: Clock, label: 'Hours', value: CONTACT.hours },
];

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  // No messaging backend yet — compose an email to the store instead so the form
  // is fully functional without inventing a fake submission.
  const onSubmit = (v) => {
    const subject = encodeURIComponent(v.subject || `Message from ${v.name}`);
    const body = encodeURIComponent(`${v.message}\n\n— ${v.name}\n${v.email}`);
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    toast.success('Opening your email app…');
    reset();
  };

  return (
    <div className="container py-16 max-w-4xl">
      <div className="text-center mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3">We'd love to hear from you</p>
        <h1 className="font-serif text-4xl md:text-5xl text-primary">Get in Touch</h1>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Questions about an order, a custom piece, or anything {BRAND_NAME}? Reach out and our team will get back to you.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-10">
        {/* Contact details */}
        <div className="md:col-span-2 space-y-6">
          {DETAILS.map((d) => (
            <div key={d.label} className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2.5 text-primary flex-shrink-0">
                <d.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{d.label}</div>
                {d.href ? (
                  <a href={d.href} className="text-sm font-medium hover:text-primary break-all">{d.value}</a>
                ) : (
                  <div className="text-sm font-medium">{d.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message form */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-3 space-y-4 rounded-xl border p-6 bg-card">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label required>Name</Label>
              <Input {...register('name', { required: 'Name is required' })} placeholder="Your name" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label required>Email</Label>
              <Input type="email" {...register('email', { required: 'Email is required' })} placeholder="you@email.com" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <Label>Subject</Label>
            <Input {...register('subject')} placeholder="How can we help?" />
          </div>
          <div>
            <Label required>Message</Label>
            <Textarea rows={5} {...register('message', { required: 'Message is required' })} placeholder="Write your message…" />
            {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
          </div>
          <Button type="submit" className="w-full sm:w-auto"><Send className="h-4 w-4 mr-2" /> Send message</Button>
        </form>
      </div>
    </div>
  );
}
