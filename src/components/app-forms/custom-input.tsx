import { ChangeEvent } from "react";
import { Control, FieldError } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IProps {
	label: string;
	name?: string;
	description?: string;
	value?: string;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	setValue?: (value: string) => void;
	control?: Control<any>;
	placeholder?: string;
	className?: string
	type?: string;
}

const ControlledInput = ({ label, name, description, control, placeholder, className, type }: Omit<IProps, "value" | "setValue" | "name" | "onChange"> & { name: string }) => {
	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input {...field} placeholder={placeholder} className={className} type={type} />
					</FormControl>
					<FormDescription>{description}</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

const UncontrolledInput = ({ label, description, value, setValue, onChange, placeholder, className, type }: Omit<IProps, "control" | "name">) => {
	return (
		<div className="flex flex-col space-y-3">
			<Label>{label}</Label>
			<Input
				value={value}
				onChange={(e) => {
					onChange && onChange(e);
					setValue && setValue(e.target.value);
				}}
				placeholder={placeholder}
				className={className}
				type={type}
			/>
			<p>{description}</p>
		</div>
	);
};

const CustomInput = (props: IProps) => {
	return props?.control ? <ControlledInput {...props} name={props?.name ?? props?.label} /> : <UncontrolledInput {...props} />;
};

export default CustomInput;