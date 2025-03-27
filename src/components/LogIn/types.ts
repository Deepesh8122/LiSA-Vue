export interface FormInputProps {
  label: string;
  placeholder: string;
  type?: string;
  modelValue: string;
}

export interface SocialButtonProps {
  icon?: string;
  variant?: "primary" | "outline";
  fullWidth?: boolean;
}
