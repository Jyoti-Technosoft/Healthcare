package com.HealthcareManagement.Service;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import org.hibernate.query.Query;

import java.util.List;

public class CustomIdGenerator implements IdentifierGenerator {
    @Override
    public Object generate(SharedSessionContractImplementor session, Object obj) throws HibernateException {
        try {
            Query<Long> query = session.createQuery("select count(p.id) from Patient p", Long.class);
            List<Long> results = query.getResultList();
            Long count = results.isEmpty() ? 0L : results.get(0);
            return "p_" + (count + 1);
        } catch (Exception e) {
            throw new HibernateException("Unable to generate patient ID", e);
        }
    }
}
