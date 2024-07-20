import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

export const getUsersSortedByDistance = async (req, res) => {
  const userId = req.session.userId;

  console.log('User ID in session:', userId);

  if (!userId) {
    return res.status(401).json({ message: 'User not logged in' });
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { latitude: true, longitude: true }
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    const users = await prisma.user.findMany({
      where: {
        NOT: { id: userId }
      }
    });

    users.forEach(user => {
      user.distance = haversineDistance(
        currentUser.latitude,
        currentUser.longitude,
        user.latitude,
        user.longitude
      );
    });

    users.sort((a, b) => a.distance - b.distance);

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};
