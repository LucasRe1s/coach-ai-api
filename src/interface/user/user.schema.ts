import z from "zod";

export const CreateUserSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string().min(6),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
});
export const UserIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID é obrigatório")
  })
});

export type UserProps = z.infer<typeof CreateUserSchema>;

export type UpdateUserProps = z.infer<typeof UpdateUserSchema>;
