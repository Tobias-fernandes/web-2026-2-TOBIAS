import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { Modal } from "./Modal";

const meta = {
  title: "UI/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Apoiado no `<dialog>` nativo: o foco fica preso dentro do formulário e o Esc fecha " +
          "sem código extra. O corpo rola sozinho quando o formulário passa de 68dvh.",
      },
    },
    // The native dialog renders in the top layer, outside the docs canvas.
    layout: "centered",
  },
  args: {
    open: true,
    title: "Novo projeto",
    onClose: fn(),
    children: null,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Open by default, to inspect the content. */
export const Aberto: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-4">
        <TextField label="Nome do projeto" placeholder="Site institucional" />
        <SelectField
          label="Cliente"
          value=""
          onValueChange={() => {}}
          options={[
            { value: "cli-1", label: "Padaria Pão de Ouro" },
            { value: "cli-2", label: "Vistoria Norte Engenharia" },
          ]}
        />
        <div className="flex justify-end gap-2">
          <Button variant="subtle">Cancelar</Button>
          <Button>Criar projeto</Button>
        </div>
      </div>
    ),
  },
};

/** Really opens and closes, to test focus and the Esc key. */
export const Interativo: Story = {
  args: { children: null },
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Abrir modal</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-4">
            <TextField
              label="Nome do projeto"
              placeholder="Site institucional"
            />
            <TextAreaField label="Escopo" />
            <div className="flex justify-end gap-2">
              <Button variant="subtle" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setOpen(false)}>Criar projeto</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

/** Long content: the body scrolls and the header stays fixed. */
export const ConteudoLongo: Story = {
  args: {
    title: "Novo cliente",
    children: (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 10 }, (_, index) => (
          <TextField key={index} label={`Campo ${index + 1}`} />
        ))}
      </div>
    ),
  },
};
