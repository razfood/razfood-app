// src/components/sites/CreateSiteForm.tsx
/**
 * @file Formulario de cliente soberano para la creación de nuevos menús (sites).
 * @author Raz Podestá - MetaShark Tech
 * @version 1.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Gestiona su propio estado con `react-hook-form` y `zodResolver`
 *              para una validación robusta y en tiempo real. Invoca la Server Action
 *              de creación al enviarse.
 */
'use client';

import { useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateSiteClientSchema } from '@/lib/validators/site.schemas';
import { logger } from '@/lib/logger';
// import { createSiteAction } from "@/lib/actions/sites.actions"; // Será creada después
// import toast from "react-hot-toast"; // Será añadido con el manejo de errores

type FormData = z.infer<typeof CreateSiteClientSchema>;

interface CreateSiteFormProps {
  workspaceId: string;
  onSuccess: () => void; // Callback para cerrar el modal
}

export function CreateSiteForm({ workspaceId, onSuccess }: CreateSiteFormProps): React.ReactElement {
  logger.trace('[CreateSiteForm] Renderizando formulario soberano.');
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(CreateSiteClientSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      subdomain: '',
      workspaceId: workspaceId,
      description: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const processSubmit: SubmitHandler<FormData> = (data) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('name', data.name || '');
      formData.append('subdomain', data.subdomain);
      formData.append('workspaceId', data.workspaceId);
      formData.append('description', data.description || '');

      // const result = await createSiteAction(formData);
      // if (result.success) {
      //   toast.success("Menú creado con éxito!");
      //   onSuccess();
      // } else {
      //   toast.error(result.error);
      // }

      logger.info('[CreateSiteForm] Placeholder: Formulario enviado.', { data });
      onSuccess(); // Simula éxito por ahora
    });
  };

  const isLoading = isSubmitting || isPending;

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 relative">
      <input type="hidden" {...register('workspaceId')} />
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Menú</Label>
        <Input id="name" placeholder="Ej: Menú Principal" {...register('name')} disabled={isLoading} />
        {errors.name && (
          <p className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="subdomain">Subdominio (URL)</Label>
        <Input id="subdomain" placeholder="ej-mi-restaurante" {...register('subdomain')} disabled={isLoading} />
        {errors.subdomain && (
          <p className="text-sm text-destructive" role="alert">
            {errors.subdomain.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Creando...' : 'Crear Menú'}
      </Button>
    </form>
  );
}

/**
 * @module create-site-form
 * @description Formulario para la creación de nuevos menús (sitios).
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Validación de Disponibilidad de Subdominio:** Proponho, na próxima fase, criar um hook `useSubdomainAvailability` que verifique em tempo real (com debounce) se o subdomínio já está em uso, invocando uma `checkSubdomainAvailabilityAction`. Isso fornecerá uma UX de élite, prevenindo erros de submissão.
 * - ((Vigente)) **Internacionalización (i18n):** Proponho refatorar este componente para que seja 100% agnóstico ao conteúdo, recebendo todos os seus textos ("Nombre del Menú", "Crear Menú", etc.) através de props.
 */
// src/components/sites/CreateSiteForm.tsx
