import { CommentIcon, CommentUpdatedIcon } from './Icons';
import { useDashboard } from './DashboardContext';
import { JSX } from 'react';
import { AstralabDashboard } from '../helpers/types';

export default function Row(): JSX.Element {
	const { trelloCards } = useDashboard();

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		});
	};

	const hasUpdates = (card: AstralabDashboard['cards'][0]) => {
		try {
			const activitiesString = card.meta?.trello_card_activities?.[0];
			if (!activitiesString) return false;

			// Enhanced JSON cleaning and error handling
			// First remove control characters
			let cleanedString = activitiesString.replace(
				/[\u0000-\u001F\u007F-\u009F]/g,
				''
			);

			// Try to fix common JSON syntax issues
			try {
				// Attempt to parse the cleaned string
				const activities = JSON.parse(cleanedString);
				if (!Array.isArray(activities)) return false;

				const latestComment = activities.find(
					(activity: { type: string; data?: { text?: string } }) =>
						activity.type === 'commentCard' && activity.data?.text
				);

				return latestComment
					? !latestComment.data.text.includes('# **Reply')
					: false;
			} catch (initialError) {
				// If the first parse fails, try more aggressive JSON repair
				console.log(
					'Initial JSON parse failed, attempting repair',
					initialError
				);

				// Try a more comprehensive approach to fix the JSON
				try {
					// Replace unescaped quotes in strings
					cleanedString = cleanedString.replace(
						/([^\\])"([^"]*)":/g,
						'$1\\"$2\\":'
					);

					// Add missing commas or fix trailing commas
					cleanedString = cleanedString.replace(/}(\s*){/g, '},{');

					// Another attempt at parsing
					const repaired = JSON.parse(cleanedString);
					if (!Array.isArray(repaired)) return false;

					const repairComment = repaired.find(
						(activity: { type: string; data?: { text?: string } }) =>
							activity.type === 'commentCard' && activity.data?.text
					);

					return repairComment
						? !repairComment.data.text.includes('# **Reply')
						: false;
				} catch (secondaryError) {
					// If all repair attempts fail, log and return false
					console.error('JSON repair failed:', secondaryError);
					console.error('Problematic JSON string:', activitiesString);
					return false;
				}
			}
		} catch (error) {
			console.error('Error in hasUpdates function:', error);
			return false;
		}
	};

	return (
		<>
			{trelloCards.length > 0 ? (
				trelloCards?.map((card) => (
					<div
						key={card.id}
						className="p-4 px-6 border border-input rounded block sm:grid sm:max-lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-6 items-center justify-between gap-4"
					>
						<div className="flex gap-2 items-center">
							<div className="font-semibold text-base uppercase">
								Project Name:
							</div>
							<div className="text-sm uppercase">{card.title}</div>
						</div>
						<div className="flex gap-2 items-center">
							<div className="font-semibold text-base uppercase">Date:</div>
							<div className="text-sm uppercase">{formatDate(card.date)}</div>
						</div>
						<div className="flex gap-2 items-center">
							<div className="font-semibold text-base uppercase">Status:</div>
							<div className="text-sm uppercase">
								{card.meta.trello_card_list}
							</div>
						</div>
						<div className="flex gap-2 items-center">
							<div className="font-semibold text-base uppercase">
								Project ID:
							</div>
							<div className="text-sm uppercase">{card.id}</div>
						</div>
						<div className="flex gap-2 items-center justify-end col-span-2">
							<div className="text-sm uppercase flex gap-2 items-center">
								<div>{card.meta.trello_card_comment_count ?? 0}</div>
								<div>
									{hasUpdates(card) ? <CommentUpdatedIcon /> : <CommentIcon />}
								</div>
							</div>
							<a
								className="text-sm uppercase p-2 px-4 border border-input text-center ml-4 rounded hover:bg-input hover:text-white max-[1024px]:w-full"
								href={card.url}
							>
								View Details
							</a>
							{card.meta.review_studio_link && (
								<a
									className="text-sm uppercase p-2 px-4 border bg border-input text-center ml-4 rounded hover:bg-input hover:text-white max-[1024px]:w-full"
									href={card.meta.review_studio_link}
								>
									Review Design
								</a>
							)}
						</div>
					</div>
				))
			) : (
				<div className="p-4 px-6 border border-input rounded block sm:grid sm:max-lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-6 items-center justify-between gap-4 bg-gray-100">
					<p>No orders yet</p>
				</div>
			)}
		</>
	);
}
