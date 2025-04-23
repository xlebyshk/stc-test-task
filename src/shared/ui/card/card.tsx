import { cn } from '@/shared/utils'

type CardProps = {
	title?: string
	className?: string
	children: React.ReactNode
}

export function Card({ title, className, children }: CardProps) {
	return (
		<div className={cn('border bg-white shadow-xl p-6 rounded-xl', className)}>
			{title && (
				<h2 className='text-2xl font-bold border-b border-black text-black pb-2 mb-6'>
					{title}
				</h2>
			)}
			{children}
		</div>
	)
}
