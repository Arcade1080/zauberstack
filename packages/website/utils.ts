import dynamic from 'next/dynamic';

export function getIcon(icon_handle: string) {
    // @ts-ignore
    const DynamicIcon = dynamic(() => import('@tabler/icons-react').then((mod) => mod[icon_handle]));
    return DynamicIcon;
}
