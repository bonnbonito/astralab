import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { ToastDemo } from './ToastDemo';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';

function App() {
	const { toast } = useToast();
	return (
		<>
			<div className="w-40 h-40 box bg-gray-200 block mx-auto my-10">
				<div className="w-full h-full text-center">Hello, World!</div>
			</div>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="outline" className="box">
						Show Dialog
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent className="bg-white">
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<Button
							onClick={() => {
								toast({
									title: 'Scheduled: Catch up',
									description: 'Friday, February 10, 2023 at 5:57 PM',
									className: 'bg-white text-black',
								});
							}}
						>
							Continue
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<Button variant="outline">Show Toaster</Button>
			<ToastDemo />
			<Toaster />
		</>
	);
}

export default App;
