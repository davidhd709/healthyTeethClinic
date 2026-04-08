import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: 'Credenciales de administrador no configuradas' },
        { status: 500 }
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generate a simple base64 token (demo only, not production-grade)
    const token = Buffer.from(`${email}:${password}`).toString('base64');

    return NextResponse.json({
      message: 'Autenticación exitosa',
      token,
      user: { email: adminEmail, role: 'admin' },
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Error en la autenticación' },
      { status: 500 }
    );
  }
}
