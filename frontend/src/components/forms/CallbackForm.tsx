'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { submitCallbackForm } from '@/lib/api/forms';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format (e.g., +1234567890)'),
  city: z.string().optional(), 
});

type FormData = z.infer<typeof formSchema>;

export function CallbackForm() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await submitCallbackForm({
        name: data.name,
        phone: data.phone,
      });
      setSuccessMessage('Thank you! We will contact you shortly.');
      reset();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Phone"
        placeholder="+1234567890"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <Input
        label="City"
        placeholder="New York"
        error={errors.city?.message}
        {...register('city')}
      />

      {serverError && <ErrorMessage message={serverError} />}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
          {successMessage}
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Request Callback
      </Button>
    </form>
  );
}
