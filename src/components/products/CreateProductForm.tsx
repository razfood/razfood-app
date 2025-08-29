// src/components/products/CreateProductForm.tsx
'use client';

/**
 * @file Formulario de cliente soberano para la creación de nuevos productos.
 * @author Raz Podestá - MetaShark Tech
 * @version 3.0.0
 * @date 2025-08-28
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato gestiona su propio estado con `react-hook-form` y `zodResolver`
 *              para una validación robusta. Es un componente de presentación puro que invoca
 *              un callback `onSubmit` con los datos validados y un callback `onSuccess`
 *              tras la finalización exitosa.
 */

import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreateProductClientSchema } from '@/lib/validators/product.schemas';
import { clientLogger } from '@/lib/logger';

type FormData = z.infer<typeof CreateProductClientSchema>;

interface CreateProductFormProps {
  siteId: string;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
  onSuccess: () => void;
}

/**
 * @public
 * @component CreateProductForm
 * @description Renderiza el formulario para crear un nuevo producto.
 * @param {CreateProductFormProps} props - Propiedades para configurar el formulario.
 * @returns {React.ReactElement}
 */
export function CreateProductForm({
  siteId,
  onSubmit,
  isPending,
  onSuccess,
}: CreateProductFormProps): React.ReactElement {
  clientLogger.trace('[CreateProductForm] Renderizando formulario soberano.');
  const t = useTranslations('ProductsPage.form');

  const form = useForm<FormData>({
    resolver: zodResolver(CreateProductClientSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      price: 0,
      siteId: siteId,
      description: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const processSubmit: SubmitHandler<FormData> = async (data) => {
    clientLogger.trace('[CreateProductForm] Formulario validado. Invocando callback onSubmit.');
    await onSubmit(data as any); // El tipo se fuerza aquí ya que el hook padre maneja la promesa.
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 relative">
      <input type="hidden" {...register('siteId')} />

      <div className="space-y-2">
        <Label htmlFor="name">{t('name_label')}</Label>
        <Input
          id="name"
          placeholder={t('name_placeholder')}
          {...register('name')}
          disabled={isPending}
          hasError={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">{t('price_label')}</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          placeholder={t('price_placeholder')}
          {...register('price', { valueAsNumber: true })}
          disabled={isPending}
          hasError={!!errors.price}
        />
        {errors.price && (
          <p className="text-sm text-destructive" role="alert">
            {errors.price.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('description_label')}</Label>
        <Textarea
          id="description"
          placeholder={t('description_placeholder')}
          {...register('description')}
          disabled={isPending}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? t('creating_button') : t('create_button')}
      </Button>
    </form>
  );
}
/**
 * @module create-product-form
 * @description Formulario para la creación de nuevos productos (ítems de menú).
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Futuras
 * - ((Vigente)) **Componente `CurrencyInput`:** Proponho, para uma UX de élite, substituir o `<Input type="number">` por um componente `CurrencyInput` especializado. Este novo componente atómico poderia formatar automaticamente o valor como moeda enquanto o usuário digita e gerenciar a conversão para o formato numérico correto, melhorando a usabilidade e prevenindo erros de entrada.
 * - ((Vigente)) **Upload de Imagem:** Adicionar um componente `ImageUploader` a este formulário. Isso permitiria aos usuários subir uma imagem para o produto, que seria armazenada no Supabase Storage e vinculada através da coluna `image_url`.
 * - ((Vigente)) **Seleção de Categoria:** Adicionar um `<Select>` para que o usuário possa associar o produto a uma ou mais `categories` (a serem criadas), permitindo uma melhor organização do menu.
 */
// src/components/products/CreateProductForm.tsx
