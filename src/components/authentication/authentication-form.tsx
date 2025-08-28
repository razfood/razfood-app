// src/components/authentication/authentication-form.tsx
/**
 * @file Componente de presentación atómico y puro para campos de email y contraseña.
 * @author Raz Podestá - MetaShark Tech
 * @version 2.0.0
 * @date 2025-08-27
 * @copyright MetaShark Tech
 * @license MIT
 * @link raz.metashark.tech
 * @description Este aparato ha sido refactorizado a un estándar de élite para ser
 *              100% agnóstico al contenido, recibiendo todas sus etiquetas de texto
 *              a través de props.
 */
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AuthFormTexts {
  emailLabel: string;
  passwordLabel: string;
}

interface Props {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  texts: AuthFormTexts;
}

export function AuthenticationForm({ email, onEmailChange, onPasswordChange, password, texts }: Props) {
  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
        <Label className={'text-muted-foreground leading-5'} htmlFor="email">
          {texts.emailLabel}
        </Label>
        <Input
          className={'border-border rounded-xs'}
          type="email"
          id="email"
          autoComplete={'username'}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label className={'text-muted-foreground leading-5'} htmlFor="password">
          {texts.passwordLabel}
        </Label>
        <Input
          className={'border-border rounded-xs'}
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
      </div>
    </>
  );
}

/**
 * @module AuthenticationForm
 * @description Componente reutilizable para los campos de autenticación.
 *
 * @section Melhora Contínua
 *
 * @subsection Melhorias Adicionadas
 * - ((Implementada)) **Full Internacionalización:** El componente ya no contiene texto codificado en duro. Recibe sus etiquetas a través de la prop `texts`, haciéndolo verdaderamente reutilizable en cualquier contexto de i18n.
 */
// src/components/authentication/authentication-form.tsx
