'use client'

import React from 'react'
import { TextLabeling } from '@/features/text-labeling'
import { Label, TextLabel } from '@/shared/types/text-labeling'

const TEXT = `Генеральному директору
ООО «Строй-Сервис М»
Иванчукову Д.Т.
крановщика
Ситдикова Л. Я.

Заявление.

Прошу предоставить мне ежегодный оплачиваемый отпуск
с «1» сентября 2016 г. по «28» сентября 2016 г.
сроком на 28 календарных дней.

_______________________/Ситдиков Л.Я./

15 августа 2016 г.`

const LABELS: Array<Label> = [
	{ label: 'ФИО', color: '#A3E635' },
	{ label: 'Дата', color: '#60A5FA' },
	{ label: 'Тип', color: '#F87171' },
]

export default function Home() {
	const [labeling, setLabeling] = React.useState<Array<TextLabel>>([])

	const handleChange = (newLabels: Array<TextLabel>) => {
		setLabeling(newLabels)
	}

	return (
		<div className='min-h-screen bg-gray-100 p-4 md:p-8'>
			<div className='mx-auto max-w-6xl flex flex-col md:flex-row gap-4'>
				<TextLabeling
					labels={LABELS}
					text={TEXT}
					labeling={labeling}
					onChange={handleChange}
				/>
			</div>
		</div>
	)
}
