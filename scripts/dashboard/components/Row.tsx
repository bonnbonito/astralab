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
		const activities = card.meta?.trello_card_activities?.[0]
			? JSON.parse(card.meta.trello_card_activities[0])
			: [];

		if (activities) {
			const latestComment = activities.find(
				(activity: { type: string }) => activity.type === 'commentCard'
			);
			if (latestComment && latestComment.data.text) {
				return !latestComment.data.text.includes('# **Reply');
			}
		}

		return false;
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
