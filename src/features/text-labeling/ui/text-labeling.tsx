'use client'

import React from 'react'
import { cn } from '@/shared/utils'
import { Card } from '@/shared/ui'
import { Label, TextLabel } from '@/shared/types/text-labeling'

type TextLabelingProps = {
	labels: Array<Label>
	text: string
	labeling: Array<TextLabel>
	onChange: (labeling: Array<TextLabel>) => void
}

type Segment = {
	text: string
	labeling?: string
}

export function TextLabeling({
	labels,
	text,
	labeling,
	onChange,
}: TextLabelingProps) {
	const textRef = React.useRef<HTMLDivElement>(null)
	const [selectedLabel, setSelectedLabel] = React.useState<Label | null>(null)

	const mouseUpHandler = React.useCallback(() => {
		if (!selectedLabel) return

		const textBlock = textRef.current
		if (!textBlock) return

		const selection = window.getSelection()
		if (!selection || selection.rangeCount === 0) return

		const range = selection.getRangeAt(0)
		if (!range) return

		const cloneRange = range.cloneRange()
		cloneRange.selectNodeContents(textBlock)
		cloneRange.setEnd(range.startContainer, range.startOffset)

		const length = range.toString().length
		if (length === 0) return

		const start = cloneRange.toString().length
		const end = start + length

		const newLabel: TextLabel = {
			start,
			end,
			label: selectedLabel.label,
		}
		const isOverlapping = labeling.some(
			label =>
				(label.start < end && label.end > start) ||
				(label.start > start && label.start < end)
		)

		if (isOverlapping) {
			selection.removeAllRanges()
			return
		}

		onChange([...labeling, newLabel])

		selection.removeAllRanges()
	}, [selectedLabel, onChange, labeling])

	const segments = React.useMemo(() => {
		const segments: Array<Segment> = []
		let lastIndex = 0

		const sortedLabeling = [...labeling].sort((a, b) => a.start - b.start)

		sortedLabeling.forEach(label => {
			if (label.start > lastIndex) {
				segments.push({ text: text.slice(lastIndex, label.start) })
			}
			segments.push({
				text: text.slice(label.start, label.end),
				labeling: label.label,
			})
			lastIndex = label.end
		})

		if (lastIndex < text.length) {
			segments.push({ text: text.slice(lastIndex) })
		}
		return segments
	}, [text, labeling])

	const colorsMap = React.useMemo(() => {
		const colorsMap: Record<string, string> = {}

		labels.forEach(label => {
			colorsMap[label.label] = label.color
		})

		return colorsMap
	}, [labels])

	return (
		<>
			<Card title='Документ' className='md:w-4/5'>
				<div
					ref={textRef}
					onMouseUp={mouseUpHandler}
					className='overflow-auto whitespace-pre-wrap cursor-text text-black'
				>
					{segments.map((segment, idx) =>
						segment.labeling ? (
							<span
								key={idx}
								style={{ backgroundColor: colorsMap[segment.labeling!] }}
							>
								{segment.text}
							</span>
						) : (
							<span key={idx}>{segment.text}</span>
						)
					)}
				</div>
			</Card>
			<Card title='Метки' className='md:w-1/5'>
				<div className='space-y-4'>
					{labels.map((label: Label) => (
						<div
							key={label.label}
							onClick={() => setSelectedLabel(label)}
							className={cn(
								'flex items-center cursor-pointer py-2 px-4 rounded-xl hover:bg-gray-200 transition-all',
								selectedLabel?.label === label.label ? 'bg-gray-200' : ''
							)}
						>
							<span
								className='w-4 h-4 mr-2'
								style={{ backgroundColor: label.color }}
							/>
							<span className='text-xl text-black select-none'>
								{label.label}
							</span>
						</div>
					))}
				</div>
			</Card>
		</>
	)
}
