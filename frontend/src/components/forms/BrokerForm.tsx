'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { submitBrokerForm } from '@/lib/api/forms';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format (e.g., +1234567890)'),
  city: z.string().optional(),
  propertyType: z.string().optional(),
  budget: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function BrokerForm() {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    try {
      const response = await submitBrokerForm({
        name: data.name,
        phone: data.phone,
        location: data.city,
        property_type: data.propertyType,
        budget: data.budget,
      });

      if (response.redirect_url) {
        window.location.assign(response.redirect_url);
      } else {
        // Fallback if no redirect URL
        alert('Submission successful!');
      }
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
      <Input
        label="Property Type"
        placeholder="Apartment, Villa, etc."
        error={errors.propertyType?.message}
        {...register('propertyType')}
      />
      <Input
        label="Budget"
        placeholder="$500,000"
        error={errors.budget?.message}
        {...register('budget')}
      />

      {serverError && <ErrorMessage message={serverError} />}

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Submit Request
      </Button>
    </form>
  );
}
