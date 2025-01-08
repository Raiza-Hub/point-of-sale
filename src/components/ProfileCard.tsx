"use client";

import Image from "next/image";

interface ProfileCardProps {
    imageUrl: string | undefined;
    userFirstName: string | undefined;
    userLastName: string | null;
    userEmail: string | undefined;
}

const ProfileCard = ({
    imageUrl,
    userFirstName,
    userLastName,
    userEmail,
}: ProfileCardProps) => {


    if (!imageUrl) return null;

    return (
        <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
            <Image
                src={imageUrl}
                width={250}
                height={250}
                alt="Podcaster"
                className="aspect-square rounded-lg"
            />
            <div className="flex flex-col justify-center max-md:items-center">
                <div className="flex flex-col gap-2.5">
                    <h1 className="text-lg font-semibold tracking-[-0.32px]">
                        {userFirstName}{" "}{userLastName}
                    </h1>

                    <p className="font-medium">{userEmail}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;