# Validación de Perfil Deportivo - Guía de Uso

## Descripción General

Se ha implementado validación robusto para el perfil deportivo del jugador usando **Zod**.

Sigue el mismo patrón que las validaciones de autenticación del proyecto.

## Validaciones Implementadas

### 1. **Posición**
- ✅ Valores permitidos (enum): Portero, Defensa Central, Lateral Derecho, Lateral Izquierdo, Mediocampista Defensivo, Mediocampista Central, Extremo Derecho, Extremo Izquierdo, Delantero Centro
- ✅ Sin caracteres extraños (solo letras, espacios, guiones)
- ❌ No permite caracteres especiales (@#$%, números, etc.)

**Ejemplo válido:** `Portero`, `Defensa Central`, `Mediocampista Central`
**Ejemplo inválido:** `Portero123`, `Pos@`, `P0rtero`

### 2. **Dorsal (dorsalNumber)**
- ✅ Número entero
- ✅ Rango: 0-99
- ❌ No números negativos
- ❌ No mayores a 99

**Ejemplo válido:** `0`, `8`, `10`, `99`
**Ejemplo inválido:** `-1`, `100`, `150`, `8.5`

### 3. **Lateralidad (laterality)**
- ✅ Valores permitidos (enum): RIGHT (Derecha), LEFT (Izquierda), BOTH (Ambidiestra)
- ✅ Campo opcional (por defecto RIGHT)

**Valores válidos:**
- `RIGHT` - Jugador diestro
- `LEFT` - Jugador zurdo
- `BOTH` - Jugador ambidiestro

### 4. **Estatura (stature)**
- ✅ Número decimal (dos decimales)
- ✅ Rango: 1.00 m a 3.00 m (100 cm a 300 cm)
- ❌ Menor a 1.00 m
- ❌ Mayor a 3.00 m

**Ejemplo válido:** `1.70`, `1.85`, `2.05`, `2.50`
**Ejemplo inválido:** `0.90`, `3.10`, `4.00`

### 5. **Estado (state)**
- ✅ Valores permitidos (enum): ACTIVE (Activo), INACTIVE (Inactivo)
- ✅ Campo opcional (por defecto ACTIVE)

**Valores válidos:**
- `ACTIVE` - Jugador disponible para jugar
- `INACTIVE` - Jugador no disponible

## Archivos Creados

1. **[athleticProfileSchemas.ts](src/modules/players/types/athleticProfileSchemas.ts)**
   - Esquema Zod: `athleticProfileSchema`
   - Tipo TypeScript: `AthleticProfileFormData`

2. **[useValidateAthleticProfile.ts](src/modules/players/hooks/useValidateAthleticProfile.ts)**
   - Función: `validateAthleticProfile()`
   - Extrae errores del esquema Zod

3. **[BecomePlayer.tsx](src/modules/players/pages/BecomePlayer.tsx)** (Refactorizado)
   - Implementa el patrón de validación
   - Estados y handlers actualizados
   - Mensajes de error mejorados

## Cómo Usar

### En Componentes (Patrón Recomendado)

```tsx
import { useState } from "react";
import { validateAthleticProfile } from "../hooks/useValidateAthleticProfile";
import { athleticProfileSchema, type AthleticProfileFormData } from "../types/athleticProfileSchemas";

type AthleticProfileErrors = Partial<
	Record<"position" | "dorsalNumber" | "laterality" | "stature" | "state", string>
>;

const initialValues: AthleticProfileFormData = {
	email: "user@example.com",
	position: "Mediocampista Central",
	dorsalNumber: 8,
	laterality: "RIGHT",
	stature: 1.7,
	state: "ACTIVE",
};

export function MyAthleticProfileForm() {
	const [values, setValues] = useState<AthleticProfileFormData>(initialValues);
	const [errors, setErrors] = useState<AthleticProfileErrors>({});

	function handleFieldChange(field: keyof AthleticProfileFormData, value: string | number) {
		setValues((currentValues) => ({
			...currentValues,
			[field]: value,
		}));

		// Limpiar error del campo cuando el usuario comienza a escribir
		setErrors((currentErrors) => {
			if (!currentErrors[field]) {
				return currentErrors;
			}
			const nextErrors = { ...currentErrors };
			delete nextErrors[field];
			return nextErrors;
		});
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const validationErrors = validateAthleticProfile(values);

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setErrors({});
		const parsedData = athleticProfileSchema.parse(values);
		// Enviar parsedData al servidor
	}

	return (
		<form onSubmit={handleSubmit}>
			<select
				value={values.position}
				onChange={(event) => handleFieldChange("position", event.target.value)}
			>
				<option value="">Selecciona tu posición</option>
				<option value="Portero">Portero</option>
				{/* ... más opciones ... */}
			</select>
			{errors.position ? <p>{errors.position}</p> : null}

			<input
				type="number"
				min="0"
				max="99"
				value={values.dorsalNumber}
				onChange={(event) => handleFieldChange("dorsalNumber", Number(event.target.value))}
			/>
			{errors.dorsalNumber ? <p>{errors.dorsalNumber}</p> : null}

			{/* ... más campos ... */}

			<button type="submit">Guardar perfil</button>
		</form>
	);
}
```

### Validar Directamente con Zod

```tsx
import { athleticProfileSchema } from "../types/athleticProfileSchemas";

const result = athleticProfileSchema.safeParse({
	email: "user@example.com",
	position: "Portero",
	dorsalNumber: 1,
	laterality: "RIGHT",
	stature: 1.85,
	state: "ACTIVE",
});

if (!result.success) {
	const fieldErrors = result.error.flatten().fieldErrors;
	console.log(fieldErrors.dorsalNumber?.[0]); // Primer error del campo
}
```

## Mensajes de Error Personalizados

- **Posición**: `"Selecciona una posición válida."` o `"La posición no puede contener caracteres extraños."`
- **Dorsal**: `"El dorsal debe ser un número entero."`, `"El dorsal no puede ser negativo."`, `"El dorsal debe ser menor a 100."`
- **Lateralidad**: `"Selecciona una lateralidad válida (Derecha, Izquierda, Ambidiestra)."`
- **Estatura**: `"La estatura debe ser mayor a 1 metro (100 cm)."` o `"La estatura debe ser menor a 3 metros (300 cm)."`
- **Estado**: `"Selecciona un estado válido (Activo, Inactivo)."`

## Validaciones Especiales

### Posición
- Validación de enum con valores predefinidos
- Validación adicional para caracteres extraños (aunque con enum ya está limitado)

### Dorsal
- Entero (sin decimales)
- Rango: 0-99
- Ideal para números de camiseta

### Estatura
- Formato decimal con hasta 2 decimales
- En metros, no en centímetros
- Rango lógico para humanos: 1.00 m - 3.00 m

## Componentes Refactorizados

### BecomePlayer.tsx
- ✅ Usa la función `validateAthleticProfile()`
- ✅ Patrón consistente con LoginForm.tsx
- ✅ Estados tipados con TypeScript
- ✅ Manejo de errores mejorado
- ✅ Mensajes de error contextuales

## Integración con Otros Módulos

Para integrar en otros componentes (CreateProfile, EditProfile):

```tsx
import { validateAthleticProfile } from "../hooks/useValidateAthleticProfile";
import { athleticProfileSchema, type AthleticProfileFormData } from "../types/athleticProfileSchemas";

// Luego usar exactamente el patrón mostrado arriba
```

## Notas Importantes

- Las validaciones se ejecutan en el cliente **antes** de enviar al servidor
- El servidor **debe** implementar validaciones similares por seguridad
- Los tipos TypeScript garantizan que el código es type-safe
- Sigue el mismo patrón que LoginForm y RegisterForm para consistencia
- Los campos `laterality` y `state` tienen valores por defecto
- El email es requerido y debe ser válido
